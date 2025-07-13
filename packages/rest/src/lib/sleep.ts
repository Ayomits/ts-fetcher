// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export async function sleepWithCallback(delay: number, callback: Function) {
  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve(callback());
    }, delay)
  );
}
