export default function useBytes(incomingObject:  any) {
  const object = {...incomingObject}
  const entries = Object.entries(object);
  for (let [key, value] of entries) {
    const bytes = transformToBytes(value as string | string[] | boolean )
    if (bytes) object[key] = bytes;
  }
  return object;
}

function transformToBytes(datas: string | string[] | boolean) {
  const encoder = new TextEncoder();
  if (typeof datas === 'string') {
    return Array.from(encoder.encode(datas));
  }
  else if (datas !== null && typeof (datas as any)[Symbol.iterator] === 'function') {
    let encoded = [];
    for (let entry of (datas as any)) {
      encoded.push(Array.from(encoder.encode(entry)));
    }
    return encoded;
  }
  else if (typeof datas === 'boolean')
    return datas ? 1 : 0;
  else return null;
}