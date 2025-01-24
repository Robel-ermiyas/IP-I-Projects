function formatCurrency(priceCents) {
  const isNegative = priceCents < 0;
  const absoluteValue = Math.abs(priceCents);
  const roundedValue = Math.round(absoluteValue);
  const formattedValue = (roundedValue / 100).toFixed(2);
  return isNegative ? `-${formattedValue}` : formattedValue;
}

export default formatCurrency;
