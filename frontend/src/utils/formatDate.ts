const formatDate = (value: Date): string =>
  Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    // month: 'short',
    // day: '2-digit',
  }).format(new Date(value));

export default formatDate;
