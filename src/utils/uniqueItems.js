function getUniqueItems(arr) {
  const res = [];
  arr.map((item) => {
    const findItem = res.find((x) => x === item);
    if (!findItem) res.push(item);
  });
  return res;
}

export { getUniqueItems };