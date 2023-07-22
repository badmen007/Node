const crypto = require('crypto');
// 把字符串转换成base64编码
function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// 把base64编码转换成字符串
function base64UrlDecode(str) {
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
}

// 生成签名
function sign(str, key) {
  // 先得到一个加盐算法，然后把str进行加密，最后返回base64编码
  return crypto.createHmac('sha256', key).update(str).digest('base64');
}

function encode(payload, key) {
  const segments = [];
  // 第一段是header
  const header = { type: 'JWT', alg: 'HS256' };
  segments.push(base64UrlEncode(JSON.stringify(header)));
  // 第二段是payload 就是把payload转换成字符串然后再base64编码
  segments.push(base64UrlEncode(JSON.stringify(payload)));
  // 第三段把header和payload的base64编码拼接起来，然后再用key进行签名
  segments.push(sign(segments.join('.'), key));
  return segments.join('.');
}

function decode(token, key) {
  const [ headerSegment, payloadSegment, signSegment ] = token.split('.');
  const payload = JSON.parse(base64UrlDecode(payloadSegment));

  if (sign([headerSegment, payloadSegment].join('.'), key) !== signSegment) {
    throw new Error('token不合法');
  }

  if (payload.exp && Date.now() > payload.exp*1000) {
    throw new Error('token已过期');
  }

  return payload
}

module.exports = {
  encode,
  decode
}
