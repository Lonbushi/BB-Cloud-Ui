import { Get, Post } from '@/utils/request';

export function getUserInfo() {
  return Get('/user/me');
}

export function Login(data) {
  // 创建URLSearchParams实例
  const formData = new URLSearchParams();
  // 添加数据到表单数据中
  formData.append('username', data.username);
  formData.append('password', data.password);

  // 调用Post函数，传递表单数据字符串
  return Post('/user/login', formData.toString());
}
export function refreshToken(refresh_token){
  return Post('/user/refresh', refresh_token);
}

export const userApi = {
  getUserInfo,
  Login,
  refreshToken,
};
