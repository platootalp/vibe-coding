# 用户实体DSL示例

entity User {
  id: Long @id
  username: String @required @unique
  email: String @required @unique
  createdAt: DateTime @required
  updatedAt: DateTime @required
}

entity UserProfile {
  id: Long @id
  userId: Long @required @reference(User)
  firstName: String
  lastName: String
  phone: String
  address: String
}

api GET /users {
  description: "获取用户列表"
  query: {
    page: Integer
    size: Integer
    sort: String
  }
  response: {
    code: Integer
    message: String
    data: [User]
  }
}

api POST /users {
  description: "创建用户"
  body: {
    username: String
    email: String
  }
  response: {
    code: Integer
    message: String
    data: User
  }
}

api GET /users/{id} {
  description: "获取用户详情"
  response: {
    code: Integer
    message: String
    data: User
  }
}

api PUT /users/{id} {
  description: "更新用户"
  body: {
    email: String
  }
  response: {
    code: Integer
    message: String
    data: User
  }
}

api DELETE /users/{id} {
  description: "删除用户"
  response: {
    code: Integer
    message: String
    data: null
  }
}