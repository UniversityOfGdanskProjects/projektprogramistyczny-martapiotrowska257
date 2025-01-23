import Link from "next/link";
import "@/app/globals.css";

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Strona główna</Link>
        </li>
        <li>
          <Link href="/koszyk">Koszyk</Link>
        </li>
        <li>
          <Link href="/ulubione">Ulubione</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
}
