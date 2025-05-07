import Main from "../Main/Main";
import "./Banners.css";

export default function Banners(props) {
  const { categories } = props;


  return (
    <main className="banners">

      <Main categories={categories}/>



    </main>
  );
}