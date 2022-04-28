export default {
  route: {
    Home: '首页',
    appList: '应用列表',
    structurePrediction: '结构预测',

  },
  navbar: {
    dashboard: '首页',
    github: '项目地址',
    logOut: '退出登录',
    profile: '个人中心',
    theme: '换肤',
    size: '布局大小',
    langselect: '语言选择',
    screenfull: '全屏'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    any: '随便填',
    thirdparty: '第三方登录',
    thirdpartyTips: '本地不能模拟，请结合自己业务进行模拟！！！',
    Notice: '没有账号,去注册',
    EmailOrTelephoneNeeded: '用户名不能为空！',
    VerificationCodeNeeded: '验证码不能为空！',
    EmailMinLengthRequired: '邮箱长度不能小于5个字符',
    EmailMaxLengthExceeded: '邮箱长度不能超过60个字符',
    EmailFormatError: '邮箱格式不正确',
    TelephoneLengthIncorrect: '手机号码长度不正确',
    TelephoneFormatError: '手机号码格式不准确',
    UsernameMinLengthRequired: '用户名长度不能小于5个字符',
    UsernameMaxLengthExceeded: '用户名长度不能超过32个字符',
    UsernameFormatError: '用户名格式不正确',
    PasswordNeeded: '密码不能为空',
    PasswordMinLengthRequired: '密码长度不能少于8个字符',
    PasswordMaxLengthExceeded: '密码长度不能超过20个字符',
    WeiXinLogin: '微信登录',
    Image: '公开镜像',
    //
    getCode:'获取验证码',
    starLogin:'星光平台登录',
    quickEnter:'直接进入主页',
    submit:'提交',
    confirm:'确认',
    cancel:'取消',
    confirmTitle:'确认信息',
    confirmMessage:'确认后将跳转到星光平台（https://starlight.nscc-gz.cn）进行用户登录；计算将使用您在星光平台上的资源进行；并将授权 ProtSim 平台使用您在星光平台上的接口权限（一类权限）;详情可见',
    explainBook:'《星光平台第三方授权说明》（链接到星光说明页面（暂无））',
    wrongName:'邮箱格式不正确',
    wrongWord:'验证码格式不对',
    sendFail:'验证码发送失败，请稍后再试',
    checkWrong:'验证码校验出错',
    loginOk:'登录成功',
  },
  register: {
    EmailNeeded: '邮箱不能为空',
    EmailAvailable: '该邮箱可以注册',
    EmailFormatError: '邮箱格式不正确',
    EmailMaxLengthExceeded: '邮箱长度不能超过60个字符',
    EmailMinLengthRequired: '邮箱长度不能小于5个字符',
    DupEmail: '该邮箱已被注册',
    TickAgreement: '请勾选同意协议',
    CorrectPhone: '请输入正确的手机号码',
    DupPhone: '该手机号码已经被注册',
    PhoneAvaliable: '该手机号可以注册',
    TelephoneNeeded: '手机号码不能为空',
    TelephoneFormatError: '手机号码格式不正确',
    RegisterCodeNeeded: '验证码不能为空',
    UsernameAvaliable: '该用户名可以注册',
    UsernameMinLengthRequired: '用户名长度不能小于5个字符',
    UsernameMaxLengthExceeded: '用户名长度不能超过32个字符',
    UsernameFormatError: '用户名格式不正确',
    DupUsername: '该用户名已经被注册',
    UsernameNeeded: '用户名不能为空',
    PasswordNeeded: '密码不能为空',
    PasswordMinLengthRequired: '密码长度不能少于8个字符',
    PasswordMaxLengthExceeded: '密码长度不能超过20个字符',
    ReenterPassword: '请重新输入密码',
    InconsistentPassword: '两次输入的密码不一致，请检查！',
    HumanRecognition: '请进行人机识别验证',
    Agreement: '《星光服务条款》',
    SignUp: '立即注册',
    PasswordFormatError: '只支持大小写字母和数字，且至少包含一个大写字母、一个小写字母和一个数字，长度为8～20个字符。'
  },
  forgetpass: {
    notice: '忘记密码?',
    EmailRetrievePassword: '该邮箱可找回密码',
    HumanRecognition: '请进行人机识别验证',
    PhoneRetrievePassword: '该手机号可找回密码',
    EnterPhoneNumber: '请输入手机号码',
    NextStep: '下一步',
    LogIn: '立即登录',
    EmptyEmail: '邮箱不能为空',
    EmailFormatError: '请输入正确的邮箱地址',
    RegisteredEmail: '填写注册使用的邮箱',
    CorrectPhone: '请输入正确的手机号码',
    RegisterPhone: '填写注册使用的手机号',
    PhoneNumberNeeded: '手机号码不能为空',
    VerifyCodeNeeded: '验证码不能为空',
    PasswordMinLengthRequired: '密码长度不能少于5个字符',
    PasswordMaxLengthExceeded: '密码长度不能超过32个字符',
    PasswordNeeded: '密码不能为空',
    ReenterPassword: '请重新输入密码',
    InconsistentPassword: '两次输入的密码不一致，请检查！'
  },
  documentation: {
    documentation: '文档',
    github: 'Github 地址'
  },
  permission: {
    addRole: '新增角色',
    editPermission: '编辑权限',
    roles: '你的权限',
    switchRoles: '切换权限',
    tips: '在某些情况下，不适合使用 v-permission。例如：Element-UI 的 el-tab 或 el-table-column 以及其它动态渲染 dom 的场景。你只能通过手动设置 v-if 来实现。',
    delete: '删除',
    confirm: '确定',
    cancel: '取消'
  },
  guide: {
    description: '引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于',
    button: '打开引导'
  },
  components: {
    documentation: '文档',
    tinymceTips: '富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。在选择富文本的过程中我也走了不少的弯路，市面上常见的富文本都基本用过了，最终权衡了一下选择了Tinymce。更详细的富文本比较和介绍见',
    dropzoneTips: '由于我司业务有特殊需求，而且要传七牛 所以没用第三方，选择了自己封装。代码非常的简单，具体代码你可以在这里看到 @/components/Dropzone',
    stickyTips: '当页面滚动到预设的位置会吸附在顶部',
    backToTopTips1: '页面滚动到指定位置会在右下角出现返回顶部按钮',
    backToTopTips2: '可自定义按钮的样式、show/hide、出现的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
    imageUploadTips: '由于我在使用时它只有vue@1版本，而且和mockjs不兼容，所以自己改造了一下，如果大家要使用的话，优先还是使用官方版本。'
  },
  table: {
    dynamicTips1: '固定表头, 按照表头顺序排序',
    dynamicTips2: '不固定表头, 按照点击顺序排序',
    dragTips1: '默认顺序',
    dragTips2: '拖拽后顺序',
    title: '标题',
    importance: '重要性',
    type: '类型',
    remark: '点评',
    search: '搜索',
    add: '添加',
    export: '导出',
    reviewer: '审核人',
    id: '序号',
    date: '时间',
    author: '作者',
    readings: '阅读数',
    status: '状态',
    actions: '操作',
    edit: '编辑',
    publish: '发布',
    draft: '草稿',
    delete: '删除',
    cancel: '取 消',
    confirm: '确 定',
    submit: '提交',
    bind: '绑定'
  },
  example: {
    warning: '创建和编辑页面是不能被 keep-alive 缓存的，因为keep-alive 的 include 目前不支持根据路由来缓存，所以目前都是基于 component name 来进行缓存的。如果你想类似的实现缓存效果，可以使用 localStorage 等浏览器缓存方案。或者不要使用 keep-alive 的 include，直接缓存所有页面。详情见'
  },
  errorLog: {
    tips: '请点击右上角bug小图标',
    description: '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  },
  excel: {
    export: '导出',
    selectedExport: '导出已选择项',
    placeholder: '请输入文件名(默认excel-list)'
  },
  zip: {
    export: '导出',
    placeholder: '请输入文件名(默认file)'
  },
  pdf: {
    tips: '这里使用   window.print() 来实现下载pdf的功能'
  },
  theme: {
    change: '换肤',
    documentation: '换肤文档',
    tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    tagsView: '开启 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '侧边栏 Logo'
  },
  bind: {
    SystemNameNeeded: '天河hpc账号不能为空',
    CanNotBeEmail: '天河hpc账号是您已经获取的天河二号高性能计算系统的账号，不是您注册星光所用的邮箱或手机。格式一般如：xyz_npq_1',
    CanNotBeTelephone: '天河hpc账号是您已经获取的天河二号高性能计算系统的账号，不是您注册星光所用的邮箱或手机。格式一般如：xyz_npq_1',
    UsernameFormatError: 'hpc账号格式不正确，格式一般如：xyz_npq_1'
  }
}
