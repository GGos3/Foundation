export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} Foundation.
        </p>
      </div>
    </footer>
  );
}
