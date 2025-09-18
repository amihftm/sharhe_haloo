export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="sticky bottom-0 w-full border-t justify-items-center">
      <div className="container flex h-14 items-center justify-center ">
        <p className="text-sm text-muted-foreground ">
          &copy; {currentYear} شرح حالوو. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
