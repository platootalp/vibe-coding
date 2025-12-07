package backend.codegen.generator;

import backend.codegen.parser.DSLParser;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 代码生成器示例
 */
public class CodeGenerator {
    
    private DSLParser parser = new DSLParser();
    
    /**
     * 根据DSL生成Java实体类
     */
    public void generateEntities(String dslFilePath, String outputDir) throws IOException {
        var entities = parser.parse(dslFilePath);
        
        // 创建输出目录
        Path outputPath = Paths.get(outputDir);
        if (!Files.exists(outputPath)) {
            Files.createDirectories(outputPath);
        }
        
        // 为每个实体生成Java类
        for (DSLParser.Entity entity : entities) {
            generateEntityClass(entity, outputDir);
        }
    }
    
    /**
     * 生成单个实体类文件
     */
    private void generateEntityClass(DSLParser.Entity entity, String outputDir) throws IOException {
        StringBuilder code = new StringBuilder();
        code.append("package com.example.generated;\n\n");
        code.append("import java.time.LocalDateTime;\n\n");
        code.append("/**\n");
        code.append(" * ").append(entity.getName()).append("实体类\n");
        code.append(" */\n");
        code.append("public class ").append(entity.getName()).append(" {\n");
        
        // 生成字段
        for (DSLParser.Field field : entity.getFields()) {
            code.append("    private ").append(mapToJavaType(field.getType()))
                .append(" ").append(field.getName()).append(";\n");
        }
        
        code.append("\n");
        
        // 生成构造函数
        code.append("    public ").append(entity.getName()).append("() {}\n\n");
        
        // 生成getter和setter方法
        for (DSLParser.Field field : entity.getFields()) {
            String capitalizedFieldName = capitalize(field.getName());
            
            // Getter
            code.append("    public ").append(mapToJavaType(field.getType()))
                .append(" get").append(capitalizedFieldName).append("() {\n");
            code.append("        return ").append(field.getName()).append(";\n");
            code.append("    }\n\n");
            
            // Setter
            code.append("    public void set").append(capitalizedFieldName)
                .append("(").append(mapToJavaType(field.getType())).append(" ")
                .append(field.getName()).append(") {\n");
            code.append("        this.").append(field.getName()).append(" = ")
                .append(field.getName()).append(";\n");
            code.append("    }\n\n");
        }
        
        code.append("}\n");
        
        // 写入文件
        String fileName = outputDir + "/" + entity.getName() + ".java";
        try (FileWriter writer = new FileWriter(fileName)) {
            writer.write(code.toString());
        }
    }
    
    /**
     * 将DSL类型映射为Java类型
     */
    private String mapToJavaType(String dslType) {
        switch (dslType.toLowerCase()) {
            case "long": return "Long";
            case "string": return "String";
            case "integer": return "Integer";
            case "datetime": return "LocalDateTime";
            case "boolean": return "Boolean";
            default: return "Object";
        }
    }
    
    /**
     * 首字母大写
     */
    private String capitalize(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}