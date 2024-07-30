import { useEffect } from "react";
import { useRouter } from "next/router";

/// default page route
const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return null;
};

export default Home;
