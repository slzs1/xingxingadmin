import {
  MiddlewareStack,
  SpraypaintBase,
  Model,
  Attr,
  HasMany,
  BelongsTo,
  HasOne
} from 'spraypaint'
import { message } from './utils/confirm'

let middleware = new MiddlewareStack()
middleware.beforeFilters.push((url: any, options: any) => {
  options.headers['Access-Control-Allow-Origin'] = '*'
})
middleware.afterFilters.push((response, json) => {
  if (response.status === 401) {
    message('登录过期，请重新登录', 'error')
    window.location.href = '/#/login'
  }
})

@Model()
export class ApplicationRecord extends SpraypaintBase {
  static baseUrl = process.env.VUE_APP_BASE_API + ''
  static apiNamespace = 'api/v1'
}

ApplicationRecord.middlewareStack = middleware
ApplicationRecord.jwtStorage = 'token'

@Model()
export class ProductCat extends ApplicationRecord {
  static jsonapiType = 'product_cats'

  @Attr() name: string
  @Attr() content: string
  @Attr() parentId: number
  @Attr() position: number
  @Attr() image: string
  @Attr() level: number
  @Attr() isHidden: boolean
  @Attr({ persist: false }) Actions: Array<string>

  @HasMany() products: Product[]
}

@Model()
export class Product extends ApplicationRecord {
  static jsonapiType = 'products'

  @Attr() sn: string
  @Attr() firmSn: string
  @Attr() title: string
  @Attr() model: string
  @Attr() category: string
  @Attr() price: number
  @Attr() costPrice: number
  @Attr() brand: string
  @Attr() length: string
  @Attr() width: string
  @Attr() height: string
  @Attr() weight: string
  @Attr() volume: string
  @Attr() video: string
  @Attr() isRecommend: boolean
  @Attr() isOff: boolean
  @Attr() salesCount: number
  @Attr() createdAt: string
  @Attr() updatedAt: string
  @Attr({ persist: false }) Actions: Array<string>

  @BelongsTo() productCat: ProductCat

  static rules = {
    price: [{
      required: true,
      validator: (rule: any, value:any, callback:any) => {
        const reg = /^\d+.?\d{0,2}$/
        if (!value) {
          callback(new Error('请输入价格'))
        } else if (!Number(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (reg.test(value)) {
            callback()
          } else {
            callback(new Error('小数点后最多只能输入两位'))
          }
        }
      },
      trigger: 'blur'
    }]
  }

  static recommendOptions = [
    {
      name: '推荐',
      value: true
    },
    {
      name: '不推荐',
      value: false
    }
  ]

  static offOptions = [
    {
      name: '下架',
      value: true
    },
    {
      name: '未下架',
      value: false
    }
  ]
}

@Model()
export class Scene extends ApplicationRecord {
  static jsonapiType = 'scenes'

  @Attr() title: string
  @Attr() content: string
  @Attr() images: Array<string>
  @Attr() slideImages: Array<string>
  @Attr() price: number
  @Attr({ persist: false }) Actions: Array<string>

  @BelongsTo() sceneCat: SceneCat
  @HasMany() products: Product[]

  static rules = {
    title: [{ required: true, message: '请输入场景名称', trigger: 'blur' }],
    content: [{ required: true, message: '请输入场景描述', trigger: 'blur' }],
    price: [{
      required: true,
      validator: (rule: any, value:any, callback:any) => {
        const reg = /^\d+.?\d{0,2}$/
        if (!value) {
          callback(new Error('请输入价格'))
        } else if (!Number(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (reg.test(value)) {
            callback()
          } else {
            callback(new Error('小数点后最多只能输入两位'))
          }
        }
      },
      trigger: 'blur'
    }]
  }
}

@Model()
export class SceneCat extends ApplicationRecord {
  static jsonapiType = 'scene_cats'

  @Attr() name: string
  @Attr() content: string
  @Attr({ persist: false }) Actions: Array<string>

  @HasMany() scenes: Scene[]

  static rules = {
    name: [{ required: true, message: '请输入场景分类名称', trigger: 'blur' }],
    content: [{ required: true, message: '请输入场景分类描述', trigger: 'blur' }]
  }
}

@Model()
export class User extends ApplicationRecord {
  static jsonapiType = 'users'

  @Attr() username: string
  @Attr() openid: string
  @Attr() phone: string
  @Attr() role: string
  @Attr() updatedAt: string
  @Attr({ persist: false }) Actions: Array<string>

  @HasMany() orders: Order[]
  @HasMany() services: Service[]
}

@Model()
export class Example extends ApplicationRecord {
  static jsonapiType = 'examples'

  @Attr() title: string
  @Attr() content: string
  @Attr() isShow: boolean
  @Attr() images: Array<string>
  @Attr() slideImages: Array<string>
  @Attr({ persist: false }) Actions: Array<string>

  @BelongsTo() exampleCat: ExampleCat

  static rules = {
    title: [{ required: true, message: '请输入案例标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入案例简介', trigger: 'blur' }]
  }

  static showOptions = [
    {
      name: '展示',
      value: true
    },
    {
      name: '不展示',
      value: false
    }
  ]

  static initForm() {
    return new Example({
      isShow: false
    })
  }
}

@Model()
export class ExampleCat extends ApplicationRecord {
  static jsonapiType = 'example_cats'

  @Attr() name: string
  @Attr() content: string
  @Attr() image: string
  @Attr({ persist: false }) Actions: Array<string>

  @HasMany() examples: Example[]

  static rules = {
    name: [{ required: true, message: '请输入案例分类名称', trigger: 'blur' }],
    content: [{ required: true, message: '请输入案例分类描述', trigger: 'blur' }]
  }
}

@Model()
export class Order extends ApplicationRecord {
  static jsonapiType = 'orders'

  @Attr() sn: string
  @Attr() state: string
  @Attr() total: number
  @Attr() amount: number
  @Attr() discountType: string
  @Attr() memo: string
  @Attr() province: string
  @Attr() city: string
  @Attr() district: string
  @Attr() house: string
  @Attr() buyerName: string
  @Attr() mobile: string
  @Attr() createdAt: string
  @Attr() updatedAt: string
  @Attr() Events: Array<string>
  @Attr({ persist: false }) Actions: Array<string>

  @BelongsTo() user: User
  @HasMany() orderItems: OrderItem[]
  @HasMany() invoices: Invoice[]
  @HasMany() logistics: Logistic[]
  @HasMany() tickets: Ticket[]

  static statusOptions = [
    {
      name: '待付款',
      value: 0
    },
    {
      name: '已取消',
      value: 1
    },
    {
      name: '待发货',
      value: 2
    },
    {
      name: '待确认',
      value: 3
    },
    {
      name: '待评价',
      value: 4
    },
    {
      name: '已完成',
      value: 5
    },
    {
      name: '已中止',
      value: 6
    }
  ]
}

@Model()
export class OrderItem extends ApplicationRecord {
  static jsonapiType = 'order_items'

  @Attr() price: number
  @Attr() number: number
  @Attr() title: string
  @Attr({ persist: false }) Actions: Array<string>

  @BelongsTo() order: Order
  @HasOne() product: Product[]
}

@Model()
export class Logistic extends ApplicationRecord {
  static jsonapiType = 'logistics'

  @Attr() orderSn: string
  @Attr() firmSn: string
  @Attr() modelWithNumber: string
  @Attr() sn: string
  @Attr() company: string
  @Attr() isDone: boolean
  @Attr() isExchange: boolean
  @Attr() memo: string
  @Attr({ persist: false }) Actions: Array<string>

  @BelongsTo() order: Order

  static rules = {
    sn: [
      { required: true, message: '请输入物流单号', trigger: 'blur' }
    ],
    company: [
      { required: true, message: '请输入物流公司', trigger: 'blur' }
    ]
  }
}

@Model()
export class Ticket extends ApplicationRecord {
  static jsonapiType = 'tickets'

  @Attr() state: string
  @Attr() event: string
  @Attr() content: string
  @Attr() images: string
  @Attr() memo: string
  @Attr() createdAt: string
  @Attr({ persist: false }) Actions: Array<string>

  @BelongsTo() order: Order
  @HasOne() user: User
}

@Model()
export class Invoice extends ApplicationRecord {
  static jsonapiType = 'invoices'

  @Attr() invoType: string
  @Attr() title: string
  @Attr() titleType: string
  @Attr() taxSn: string
  @Attr() orderSn: string
  @Attr() orderAt: string
  @Attr() email: string
  @Attr({ persist: false }) Actions: Array<string>

  @BelongsTo() user: User
  @HasOne() order: Order

  static invoTypeOptions = [
    {
      name: '普通',
      value: 0
    },
    {
      name: '电子',
      value: 1
    }
  ]

  static titleTypeOptions = [
    {
      name: '企业',
      value: 0
    },
    {
      name: '个人',
      value: 1
    }
  ]
}

@Model()
export class Service extends ApplicationRecord {
  static jsonapiType = 'services'

  @Attr() userId: number
  @Attr() serviceType: string
  @Attr() model: string
  @Attr() repair: string
  @Attr() details: string
  @Attr() name: string
  @Attr() phone: number
  @Attr() address: string
  @Attr() state: string
  @Attr() reservedAt: string
  @Attr({ persist: false }) Actions: Array<string>
  @Attr() Events: Array<string>

  @BelongsTo() user: User

  static typeOptions = [
    {
      name: '一键报修',
      value: '0'
    },
    {
      name: '设备检修',
      value: '1'
    },
    {
      name: '设备清洗',
      value: '2'
    },
    {
      name: '设备回收',
      value: '3'
    },
    {
      name: '物流托运',
      value: '4'
    }
  ]
}

@Model()
export class Post extends ApplicationRecord {
  static jsonapiType = 'posts'

  @Attr() title: string
  @Attr() content: string
  @Attr() images: Array<string>
  @Attr() products: string
  @Attr({ persist: false }) Actions: Array<string>

  static rules = {
    title: [
      { required: true, message: '请输入海报标题', trigger: 'blur' },
      { max: 128, message: '长度在128 个字符以内', trigger: 'blur' }
    ]
  }

  static initForm() {
    return new Post({
      isShow: false
    })
  }
}

@Model()
export class Banner extends ApplicationRecord {
  static jsonapiType = 'banners'

  @Attr() title: string
  @Attr() location: string
  @Attr() image: string
  @Attr() linkTo: string
  @Attr() position: string
  @Attr({ persist: false }) Actions: Array<string>

  static rules = {
    title: [
      { required: true, message: '请输入海报标题', trigger: 'blur' },
      { max: 128, message: '长度在128 个字符以内', trigger: 'blur' }
    ]
  }

  static posOptions = ['top', 'middle']
  static linkTypeOptions = [
    { name: '商品', value: 'product' },
    { name: '场景', value: 'scene' },
    { name: '案例', value: 'example' },
    { name: '海报', value: 'post' }
  ]

  static initForm() {
    return new Banner({
      isShow: false,
      location: 'top'
    })
  }
}

@Model()
export class Comment extends ApplicationRecord {
  static jsonapiType = 'comments'

  @Attr() username: string
  @Attr() content: string
  @Attr() images: Array<string>
  @Attr() rate: number
  @Attr() isShow: boolean
  @Attr() createdAt: string
  @Attr({ persist: false }) Actions: Array<string>

  @BelongsTo() user: User
  @BelongsTo() product: Product

  static rules = {
    username: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { max: 6, message: '长度在6 个字符以内', trigger: 'blur' }
    ],
    content: [
      { required: true, message: '请输入评论内容', trigger: 'blur' },
      { max: 400, message: '长度在400 个字符以内', trigger: 'blur' }
    ]
  }
}

@Model()
export class Permission extends ApplicationRecord {
  static jsonapiType = 'permissions'

  @Attr() action: Array<string>
  @Attr() subject: string
  @Attr({ persist: false }) Actions: Array<string>
}

@Model()
export class Customer extends ApplicationRecord {
  static jsonapiType = 'customers'

  @Attr() title: string
  @Attr() content: string
  @Attr() mobile: string
  @Attr() createdAt: string
  @Attr({ persist: false }) Actions: Array<string>
}

@Model()
export class Setting extends ApplicationRecord {
  static jsonapiType = 'settings'

  @Attr() value: string
  @Attr() type: string
  @Attr({ persist: false }) Actions: Array<string>
}
