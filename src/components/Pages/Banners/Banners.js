import Main from "../Main/Main";
import "./Banners.css";

export default function Banners(props) {
  const { banners } = props;
  const mainBanner = banners[0];
  const subBanners = banners.slice(1);

  if (banners.length == 0) return;

  return (
    <main className="banners">
      {/* <div className="banners__main"> */}

        {/* <h1 className="banners__logo">
          {mainBanner.title}
        </h1>
        <h2 className="banners__title banners__title_border">
          {mainBanner.subtitle}
        </h2> */}
        {/* <div className="banners__text banners__text_main">
          {
            mainBanner.paragraphs.map((text, i) => 
              <p className={`banners__paragraph ${i == 0 ? 
                "banners__paragraph_separate" : ""
              }`}
                key={`text-main-${i}`}
              >
                {text}
              </p>
            )
          }
        </div> */}
        {/* <img className="banners__main-bg"
          src={mainBanner.image}
          crossOrigin=""
        /> */}
      {/* </div> */}


      <Main />


      {/* {
        subBanners.map((banner, i) => 
          <div className="banners__banner" 
            key={`banner-${i}`}
          >
            <h2 className="banners__title">
              {banner.title}
            </h2>
            <div className="banners__image-container">
              {
                banner.image ? 
                <img className="banners__image"
                  src={banner.image}
                  alt="banner image"
                  crossOrigin=""
                />
                : ""
              }
            </div>
            <div className="banners__info">
              <p className="banners__paragraph banners__paragraph_subtitle">
                {banner.subtitle}
              </p>
              <div className="banners__text">
                {
                  banner.paragraphs.map((text, i) => 
                    <p className="banners__paragraph"
                      key={`text-banner-${i}`}
                    >
                      {text}
                    </p>
                  )
                }
              </div>
            </div>
          </div>
        )
      } */}
    </main>
  );
}