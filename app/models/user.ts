import { ISchema } from '../../framework/types.ts'

export default <ISchema>{
  model: {
    id: { type: 'integer', description: 'ID' },
    phone: { type: 'string', description: '手机号' },
    password: { type: 'string', length: 32, description: '密码' },
    nickname: { type: 'string', length: 32, description: '昵称' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
    deletedAt: { type: 'date' }
  }
}