import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeaderSlider.css";

const sliderData = [
  {
    id: 1,
    title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
    offer: "Limited Time Offer 30% Off",
    buttonText1: "Buy now",
    buttonText2: "Find more",
    imgSrc: "/assets/banners/header_headphone_image.png",
  },
  {
    id: 2,
    title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
    offer: "Hurry up only few lefts!",
    buttonText1: "Shop Now",
    buttonText2: "Explore Deals",
    imgSrc: "/assets/banners/header_playstation_image.png",
  },
  {
    id: 3,
    title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
    offer: "Exclusive Deal 40% Off",
    buttonText1: "Order Now",
    buttonText2: "Learn More",
    imgSrc: "/assets/banners/header_macbook_image.png",
  },
];

function HeaderSlider() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="header-slider">
      <div
        className="header-slider__track"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            className="header-slider__slide"
            key={slide.id}
          >
            <div className="header-slider__content">
              <p className="header-slider__offer">
                {slide.offer}
              </p>

              <h1 className="header-slider__title">
                {slide.title}
              </h1>

              <div className="header-slider__actions">
                <button
                  type="button"
                  className="header-slider__primary-button"
                  onClick={() => navigate("/shop")}
                >
                  {slide.buttonText1}
                </button>

                <button
                  type="button"
                  className="header-slider__secondary-button"
                  onClick={() => navigate("/shop")}
                >
                  <span>{slide.buttonText2}</span>

                  <img
                    src="/assets/icons/arrow_icon.svg"
                    alt=""
                  />
                </button>
              </div>
            </div>

            <div className="header-slider__image-container">
              <img
                className="header-slider__image"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="header-slider__dots">
        {sliderData.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`header-slider__dot ${
              currentSlide === index
                ? "header-slider__dot--active"
                : ""
            }`}
            onClick={() => handleSlideChange(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeaderSlider;