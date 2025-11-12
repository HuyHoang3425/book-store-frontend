export const configOptionEditCategory = (categories = [], currentId) => {
  let options = [];
  let currentLevel = null;

  const traverse = (list, level = 0) => {
    for (const c of list) {
      if (c._id === currentId) {
        currentLevel = level;
        continue;
      }

      options.push({
        label: <span>{"-- ".repeat(level) + c.title}</span>,
        value: c._id,
        title: c.title,
        level,
      });

      if (c.children?.length) traverse(c.children, level + 1);
    }
  };

  traverse(categories);

  if (currentLevel === null) return options;
  else if (currentLevel === 0)
    return options.filter((o) => o.level <= currentLevel);
  return options.filter((o) => o.level < currentLevel);
};
