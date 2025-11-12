export const configOption = (categories = [], level = 0) => {
  let options = [];

  for (const c of categories) {
    options.push({
      label: <span>{"-- ".repeat(level) + c.title}</span>,
      value: c._id,
      title: c.title,
    });

    if (c.children && c.children.length > 0) {
      options = options.concat(configOption(c.children, level + 1));
    }
  }

  return options;
};
