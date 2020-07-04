import { ISchema } from '../../framework/types.ts'

export default <ISchema>{
  model: {
<<<<<<< HEAD
    id: { type: 'integer' },
    phone: { type: 'string', length: 11, description: '手机号' },
=======
    id: { type: 'integer', description: 'ID' },
    phone: { type: 'string', description: '手机号' },
>>>>>>> 2a3e11036c7a716fa765ba08ad57dfe89874043b
    password: { type: 'string', length: 32, description: '密码' },
    nickname: { type: 'string', length: 32, description: '昵称' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
    deletedAt: { type: 'date' }
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 2a3e11036c7a716fa765ba08ad57dfe89874043b
