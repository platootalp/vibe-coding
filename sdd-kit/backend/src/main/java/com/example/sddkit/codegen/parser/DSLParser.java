package backend.codegen.parser;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * 简单的DSL解析器示例
 */
public class DSLParser {
    
    public static class Entity {
        private String name;
        private List<Field> fields = new ArrayList<>();
        
        public Entity(String name) {
            this.name = name;
        }
        
        public void addField(Field field) {
            fields.add(field);
        }
        
        // Getters
        public String getName() { return name; }
        public List<Field> getFields() { return fields; }
    }
    
    public static class Field {
        private String name;
        private String type;
        private List<String> annotations = new ArrayList<>();
        
        public Field(String name, String type) {
            this.name = name;
            this.type = type;
        }
        
        public void addAnnotation(String annotation) {
            annotations.add(annotation);
        }
        
        // Getters
        public String getName() { return name; }
        public String getType() { return type; }
        public List<String> getAnnotations() { return annotations; }
    }
    
    /**
     * 解析DSL文件
     */
    public List<Entity> parse(String filePath) throws IOException {
        List<Entity> entities = new ArrayList<>();
        Entity currentEntity = null;
        
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                
                // 忽略空行和注释
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                
                // 解析实体定义
                if (line.startsWith("entity ")) {
                    String entityName = line.substring(7, line.length() - 1).trim();
                    currentEntity = new Entity(entityName);
                    entities.add(currentEntity);
                } 
                // 解析字段定义
                else if (currentEntity != null && line.contains(":") && !line.startsWith("}")) {
                    String[] parts = line.split(":", 2);
                    String fieldName = parts[0].trim();
                    String fieldTypeAndAnnotations = parts[1].trim();
                    
                    // 处理末尾的分号
                    if (fieldTypeAndAnnotations.endsWith(";")) {
                        fieldTypeAndAnnotations = fieldTypeAndAnnotations.substring(0, fieldTypeAndAnnotations.length() - 1);
                    }
                    
                    Field field = new Field(fieldName, extractType(fieldTypeAndAnnotations));
                    extractAnnotations(fieldTypeAndAnnotations, field);
                    currentEntity.addField(field);
                }
            }
        }
        
        return entities;
    }
    
    private String extractType(String fieldTypeAndAnnotations) {
        String[] parts = fieldTypeAndAnnotations.split("@");
        return parts[0].trim();
    }
    
    private void extractAnnotations(String fieldTypeAndAnnotations, Field field) {
        String[] parts = fieldTypeAndAnnotations.split("@");
        for (int i = 1; i < parts.length; i++) {
            String annotation = parts[i].trim();
            if (annotation.contains(" ")) {
                annotation = annotation.substring(0, annotation.indexOf(" "));
            }
            field.addAnnotation("@" + annotation);
        }
    }
}