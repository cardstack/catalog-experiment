function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }

    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }

  return number;
}
export { baseClamp as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWypYmFzZUNsYW1wBcDAl5ehbwAAAcCQwJehbwAAAgSQwJmhZADM+APAkQPAwpmhbKliYXNlQ2xhbXCSAwbAwMDAkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlQ2xhbXAuanOYoXIJCcDAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgAJwMCRAsDC
====catalogjs annotation end====*/