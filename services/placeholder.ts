interface PlaceholderValues {
  roleId?: string;
  userId?: string;
  level?: number;
}

export function replacePlaceHolders(str: string, values: PlaceholderValues) {
  const variables: {
    placeholder: string;
    value: "level" | "roleId" | "userId";
  }[] = [
    { placeholder: "{level}", value: "level" },
    { placeholder: "{user}", value: "userId" },
    { placeholder: "{role}", value: "roleId" },
  ];

  let i = 0;

  while (i < variables.length) {
    if (str.includes(variables[i].placeholder)) {
      str = str.replace(
        variables[i].placeholder,
        values[variables[i].value]?.toString() || "undefined"
      );
    } else i++;
  }

  return str;
}
