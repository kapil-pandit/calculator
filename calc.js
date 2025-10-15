function add(numbers) {
  if (!numbers) return 0;

  let delimiter = /,|\n/; // default delimiters: comma or newline
  let numString = numbers;

  // Check for custom delimiter
  if (numbers.startsWith("//")) {
    const parts = numbers.split("\n");
    const delimiterPart = parts[0].slice(2); // remove leading "//"
    numString = parts.slice(1).join("\n"); // rest of the string is numbers
    delimiter = new RegExp(delimiterPart); // support regex delimiters
  }

  // Split numbers using the delimiter(s)
  const numList = numString.split(delimiter).map(n => n.trim()).filter(n => n !== "");

  // Convert to Integers
  const values = numList.map(Number);

  // Test for Negatives
  const negatives = values.filter(n => n < 0);
  if (negatives.length > 0) {
    throw new Error(`negative numbers not allowed: ${negatives.join(", ")}`);
  }

  // Calculate Addition
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  return sum;
}

// ---------------------------
// ✅  Test Cases samples
// ---------------------------
try {
  console.log(add("")); // 0
  console.log(add("1")); // 1
  console.log(add("1,5")); // 6
  console.log(add("1\n2,3")); // 6
  console.log(add("//;\n1;2")); // 3
  console.log(add("//|\n1|2|3")); // 6
  console.log(add("//-\n4-5-6")); // 15
  console.log(add("1,-2,3,-4")); // throws error
} catch (e) {
  console.error(e.message);
}
