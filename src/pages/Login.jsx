import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (isAuthenticated) {
        navigate("/app", { replace: true });
        //navigate("/app"):Bu komut, kullanıcıyı /app sayfasına yönlendirir. Geçmişe yeni bir giriş ekler. Yani, kullanıcı geri tuşuna bastığında bir önceki sayfaya (örneğin login sayfasına) dönebilir.

        //navigate("/app", { replace: true }): Bu komut, kullanıcıyı /app sayfasına yönlendirir. Geçmişteki mevcut girişin üzerine yazar. Yani, kullanıcı geri tuşuna bastığında login sayfasına dönemez, çünkü yönlendirme geçmişe eklenmez. Önceki sayfa kaydedilmez. Direkt olarak 2 öncesine döner ve useEffectten kurtulmuş anasayfaya dönmüş olursun.
      }
    },
    [isAuthenticated, navigate]
  );
  function handleLogin(e) {
    e.preventDefault();
    if (email && password) {
      login(email, password);
    }
  }

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">LOGIN</Button>
        </div>
      </form>
    </main>
  );
}
