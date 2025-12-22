import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.schemas.apps import (
    AppDefinition, AppBase, AppVersion, PublishedAppInfo,
    AppPublishRequest, AppPublishResponse, VersionComparison
)
from app.services.workflow.workflow_manager import workflow_manager
from app.utils.logger import logger


class AppManager:
    """应用管理器"""
    
    def __init__(self):
        # 内存存储，实际生产环境应使用数据库
        self.apps: Dict[str, AppDefinition] = {}
        self.versions: Dict[str, List[AppVersion]] = {}
        self.published_apps: Dict[str, PublishedAppInfo] = {}
    
    def create_app(self, app_base: AppBase) -> AppDefinition:
        """创建应用"""
        try:
            app_id = str(uuid.uuid4())
            
            app = AppDefinition(
                app_id=app_id,
                **app_base.model_dump()
            )
            
            # 初始化版本列表
            self.versions[app_id] = []
            
            # 创建初始版本
            self._create_version(app_id, "v1.0.0", "初始版本")
            
            self.apps[app_id] = app
            logger.info(f"Created app: {app_id}, name: {app.name}")
            return app
        except Exception as e:
            logger.error(f"Failed to create app: {str(e)}")
            raise
    
    def get_app(self, app_id: str) -> Optional[AppDefinition]:
        """获取应用"""
        return self.apps.get(app_id)
    
    def get_all_apps(self) -> List[AppDefinition]:
        """获取所有应用"""
        return list(self.apps.values())
    
    def update_app(self, app_id: str, app_base: AppBase) -> AppDefinition:
        """更新应用"""
        try:
            app = self.apps.get(app_id)
            if not app:
                raise ValueError(f"App not found: {app_id}")
            
            updated_app = AppDefinition(
                app_id=app_id,
                **app_base.model_dump(),
                is_published=app.is_published,
                created_at=app.created_at,
                updated_at=datetime.now()
            )
            
            self.apps[app_id] = updated_app
            logger.info(f"Updated app: {app_id}, name: {updated_app.name}")
            return updated_app
        except Exception as e:
            logger.error(f"Failed to update app {app_id}: {str(e)}")
            raise
    
    def delete_app(self, app_id: str) -> bool:
        """删除应用"""
        try:
            if app_id in self.apps:
                del self.apps[app_id]
                if app_id in self.versions:
                    del self.versions[app_id]
                if app_id in self.published_apps:
                    del self.published_apps[app_id]
                logger.info(f"Deleted app: {app_id}")
                return True
            return False
        except Exception as e:
            logger.error(f"Failed to delete app {app_id}: {str(e)}")
            raise
    
    def publish_app(self, app_id: str, publish_request: AppPublishRequest) -> AppPublishResponse:
        """发布应用"""
        try:
            app = self.apps.get(app_id)
            if not app:
                raise ValueError(f"App not found: {app_id}")
            
            # 验证应用配置（检查工作流是否存在）
            if app.workflow_id:
                workflow = workflow_manager.get_workflow(app.workflow_id)
                if not workflow:
                    raise ValueError(f"Associated workflow not found: {app.workflow_id}")
            
            # 创建新版本
            version_number = self._generate_next_version(app_id)
            version = self._create_version(
                app_id=app_id,
                version_number=version_number,
                description=publish_request.version_description
            )
            
            # 生成唯一endpoint和API Key
            endpoint = f"/v1/apps/{app_id}/completions"
            api_key = str(uuid.uuid4())
            
            # 保存发布信息
            published_info = PublishedAppInfo(
                endpoint=endpoint,
                api_key=api_key,
                published_at=datetime.now(),
                version_id=version.version_id
            )
            
            self.published_apps[app_id] = published_info
            
            # 更新应用状态
            app.is_published = True
            app.updated_at = datetime.now()
            self.apps[app_id] = app
            
            logger.info(f"Published app: {app_id}, endpoint: {endpoint}")
            
            return AppPublishResponse(
                success=True,
                app_id=app_id,
                published_info=published_info
            )
        except Exception as e:
            logger.error(f"Failed to publish app {app_id}: {str(e)}")
            return AppPublishResponse(
                success=False,
                app_id=app_id,
                error_message=str(e)
            )
    
    def unpublish_app(self, app_id: str) -> bool:
        """取消发布应用"""
        try:
            if app_id in self.published_apps:
                del self.published_apps[app_id]
                
                app = self.apps[app_id]
                app.is_published = False
                app.updated_at = datetime.now()
                self.apps[app_id] = app
                
                logger.info(f"Unpublished app: {app_id}")
                return True
            return False
        except Exception as e:
            logger.error(f"Failed to unpublish app {app_id}: {str(e)}")
            raise
    
    def get_published_info(self, app_id: str) -> Optional[PublishedAppInfo]:
        """获取应用发布信息"""
        return self.published_apps.get(app_id)
    
    def _create_version(self, app_id: str, version_number: str, description: Optional[str]) -> AppVersion:
        """创建应用版本"""
        try:
            version_id = str(uuid.uuid4())
            app = self.apps.get(app_id)
            
            if not app:
                raise ValueError(f"App not found: {app_id}")
            
            # 创建版本快照
            config_snapshot = {
                "name": app.name,
                "type": app.type,
                "description": app.description,
                "config": app.config,
                "workflow_id": app.workflow_id,
                "knowledge_base_ids": app.knowledge_base_ids
            }
            
            version = AppVersion(
                version_id=version_id,
                app_id=app_id,
                version_number=version_number,
                description=description,
                config_snapshot=config_snapshot,
                is_active=True
            )
            
            # 更新现有版本的活跃状态
            for existing_version in self.versions[app_id]:
                existing_version.is_active = False
            
            # 添加新版本
            self.versions[app_id].append(version)
            logger.info(f"Created version for app {app_id}: {version_number}")
            return version
        except Exception as e:
            logger.error(f"Failed to create version for app {app_id}: {str(e)}")
            raise
    
    def _generate_next_version(self, app_id: str) -> str:
        """生成下一个版本号"""
        versions = self.versions.get(app_id, [])
        if not versions:
            return "v1.0.0"
        
        # 简单版本号生成逻辑，实际生产环境应使用更复杂的版本管理
        last_version = versions[-1].version_number
        if last_version.startswith("v"):
            last_version = last_version[1:]
        
        parts = last_version.split(".")
        if len(parts) == 3:
            major, minor, patch = map(int, parts)
            return f"v{major}.{minor}.{patch + 1}"
        
        return f"v{last_version}.1"
    
    def get_app_versions(self, app_id: str) -> List[AppVersion]:
        """获取应用的所有版本"""
        return self.versions.get(app_id, [])
    
    def rollback_app(self, app_id: str, version_id: str) -> AppDefinition:
        """回滚应用到指定版本"""
        try:
            app = self.apps.get(app_id)
            if not app:
                raise ValueError(f"App not found: {app_id}")
            
            app_versions = self.versions.get(app_id, [])
            target_version = next((v for v in app_versions if v.version_id == version_id), None)
            
            if not target_version:
                raise ValueError(f"Version not found: {version_id}")
            
            # 从版本快照恢复应用配置
            snapshot = target_version.config_snapshot
            
            app_base = AppBase(
                name=snapshot["name"],
                type=snapshot["type"],
                description=snapshot["description"],
                config=snapshot["config"]
            )
            
            updated_app = AppDefinition(
                app_id=app_id,
                **app_base.model_dump(),
                workflow_id=snapshot["workflow_id"],
                knowledge_base_ids=snapshot["knowledge_base_ids"],
                is_published=app.is_published,
                created_at=app.created_at,
                updated_at=datetime.now()
            )
            
            self.apps[app_id] = updated_app
            
            # 更新版本活跃状态
            for version in app_versions:
                version.is_active = version.version_id == version_id
            
            logger.info(f"Rolled back app {app_id} to version {version_id}")
            return updated_app
        except Exception as e:
            logger.error(f"Failed to rollback app {app_id} to version {version_id}: {str(e)}")
            raise
    
    def compare_versions(self, app_id: str, version_id1: str, version_id2: str) -> VersionComparison:
        """对比两个版本之间的差异"""
        try:
            app = self.apps.get(app_id)
            if not app:
                raise ValueError(f"App not found: {app_id}")
            
            app_versions = self.versions.get(app_id, [])
            
            # 查找两个版本
            version1 = next((v for v in app_versions if v.version_id == version_id1), None)
            version2 = next((v for v in app_versions if v.version_id == version_id2), None)
            
            if not version1:
                raise ValueError(f"Version not found: {version_id1}")
            if not version2:
                raise ValueError(f"Version not found: {version_id2}")
            
            # 比较版本差异
            differences = self._compare_snapshots(version1.config_snapshot, version2.config_snapshot)
            
            logger.info(f"Compared versions {version_id1} and {version_id2} for app {app_id}")
            
            return VersionComparison(
                app_id=app_id,
                version1=version1,
                version2=version2,
                differences=differences
            )
        except ValueError as e:
            logger.error(f"Version comparison failed: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Failed to compare versions for app {app_id}: {str(e)}")
            raise
    
    def _compare_snapshots(self, snapshot1: Dict[str, Any], snapshot2: Dict[str, Any]) -> Dict[str, Any]:
        """比较两个配置快照之间的差异"""
        differences = {}
        
        # 合并所有键
        all_keys = set(snapshot1.keys()).union(set(snapshot2.keys()))
        
        for key in all_keys:
            val1 = snapshot1.get(key)
            val2 = snapshot2.get(key)
            
            if val1 != val2:
                differences[key] = {
                    "old_value": val1,
                    "new_value": val2
                }
        
        return differences


# 创建全局实例
app_manager = AppManager()
