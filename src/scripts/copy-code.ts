const copiedIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
    width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0
      L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018
      L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
  </svg>
`;

document.querySelectorAll<HTMLButtonElement>("prose-content [data-code-copy]").forEach((button) => {
  const code = button.parentElement?.querySelector("pre code");
  if (!code) return;

  const idleIcon = button.innerHTML;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code.textContent ?? "");
      button.dataset.copyState = "copied";
      button.innerHTML = copiedIcon;

      window.setTimeout(() => {
        button.dataset.copyState = "idle";
        button.innerHTML = idleIcon;
      }, 1500);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  });
});
