import coffeeShop from './assets/coffee-shop-img.svg';
import edgeWater2 from './assets/edgewater-2-img.svg';
import edgewater from './assets/edgewater-img.svg';
import fallFolliage from './assets/fall-folliage.svg';
import goldenGardens from './assets/golden-gardens.svg';
import golf from './assets/golf-img.svg';
import poke from './assets/poke-img.svg';
import seattleAbove from './assets/seattle-above.svg';
import snowyVillage from './assets/snowy-village-img.svg';
import hiking from './assets/hiking.svg';
import summerFlowers from './assets/summer-flowers.svg';
import fremont from './assets/fremont.svg';
import alpine from './assets/alpine.svg';
import kirkland from './assets/kirkland.svg';
import mariners from './assets/mariners.svg';
import sushi from './assets/sushi-img.svg';
import aisha from './assets/aisha-prof-pic.svg';
import jan from './assets/jan-prof-pic.svg';
import jacob from './assets/jacob-prof-pic.svg';
import cp from './assets/cedarpinelogo.svg';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="container">

      {/* LEFT COLUMN */}
      <div>
        <section className="">
          <h1 className='title-text'>See Seattle Like a Local</h1>
          <p className='title-subtext'>Skip the tourist traps. Explore with a friendly, vetted local.</p>
        </section>

        <Link to="/book" className="hide-on-desktop">
          <button className="button section-spacer mobile-button">Book Your Local Buddy</button>
        </Link>
        <section className="section section-spacer top-spacer">
          <h2>☕ How It Works</h2>
            <p>Pick Your Vibe: Foodie, artsy, nature lover, or a mix.</p>
            <p>We match you with a vetted Seattle local.</p>
            <p>Explore together. Custom-planned day + candid photos.</p>
        {/* Hide on mobile */}
        <Link to="/book" className="hide-on-mobile">
          <button className="button">Book Your Local Buddy</button>
        </Link>
        </section>

        {/* <section className="section section-spacer">
          <h2>👯‍♀️ Meet Your Local Friend</h2>
        </section>

        <section className="section section-spacer">
          <h2>🗺️ Explore Together</h2>
        </section> */}


        <section className="section section-spacer">
          <h2>💼 Packages and Pricing</h2>
          <p>Half-Day with Guide (4 hrs) — <strong>$150</strong></p>
          <p>Full Day with Guide (8 hrs) — <strong>$250</strong></p>
          <p>Includes itinerary planning, guiding, and candid photos.</p>
        </section>

        <section className="section">
          <h3>📍 Custom Itinerary</h3>
          <p>1-Day Curated Plan — <b>$50</b></p>
          <p>3-Day Curated Plan — <b>$120</b></p>
          <p>For when you don't need a guide but would like a plan.</p>
        </section>

        <section className="section section-spacer">
          <h3>📋 Quick Rec List</h3>
          <p>Curated "top picks" list — <b>$25</b></p>
          <p>Best for short trips or last-minute planning.</p>
          {/* Hide on mobile */}
          <Link to="/itineraries" className="hide-on-mobile">
            <button className="button">Learn More About Itineraries</button>
          </Link>
          {/* Hide on desktop */}
          <Link to="/itineraries" className="hide-on-desktop">
            <button className="button section-spacer mobile-button mobile-button-secondary">Get An Itinerary</button>
          </Link>
        </section>

        <section className="section">
          <h2 className='locals-title'>🤠 Meet The Locals</h2>
          <div className='guide-card'>
            <div className='pic-and-text'>
              <img className="prof-pic" src={aisha} alt="Aisha"/>
              <div>
                <div className='guide-name-and-rating'>
                  <p className='guide-name-and-text'><strong>Aisha (29)</strong> </p>
                  <p className='guide-rating'>⭐️⭐️⭐️⭐️⭐️</p>
                </div>
                <p className='guide-name-and-text'>Raised in Seattle. Loves coffee shops, views, and ferry rides.</p>
                <p className='guide-review-text'>"5 stars. I had an amazing day in Seattle with Aisha"—Christina B.</p>
              </div>
            </div>
          </div>
          <div className='guide-card'>
            <div className='pic-and-text'>
              <img className="prof-pic" src={jan} alt="Jan"/>
              <div>
                <div className='guide-name-and-rating'>
                  <p className='guide-name-and-text'><strong>Jan (29)</strong> </p>
                  <p className='guide-rating'>⭐️⭐️⭐️⭐️⭐️</p>
                </div>
                <p className='guide-name-and-text'>Originally from Guam. Loves breweries, festivals, meeting people.</p>
                <p className='guide-review-text'>"Janel was so fun and informative."—Brittany M.</p>
              </div>
            </div>
          </div>
          <div className='guide-card'>
            <div className='pic-and-text'>
              <img className="prof-pic" src={jacob} alt="jacob"/>
              <div>
                <div className='guide-name-and-rating'>
                  <p className='guide-name-and-text'><strong>Jacob (32)</strong> </p>
                  <p className='guide-rating'>⭐️⭐️⭐️⭐️⭐️</p>
                </div>
                <p className='guide-name-and-text'>Boy from Milwaukee. Loves Seattle, music, coffee.</p>
                <p className='guide-review-text'>"I loved meeting Jacob and exploring the town! 10/10 experience."—Felicidad S.</p>
              </div>
            </div>
          </div>
          {/* Hide on mobile */}
          <Link to="/book" className="hide-on-mobile">
            <button className="button secondary-book-button">Book Your Local Buddy</button>
          </Link>
        </section>

        <div className='cedar-pine-text hide-on-mobile'>site designed & engineered by <img src={cp} className='cedar-pine-logo'/></div>
        <div className='copyright-text hide-on-mobile'>© 2025 All rights Reserved. Meadow North, LLC.</div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="image-grid hide-on-mobile">
        <ImageCard src={fallFolliage} loading="lazy" />
        <ImageCard src={poke} loading="lazy"/>
        <ImageCard src={golf} loading="lazy"/>
        <ImageCard src={seattleAbove} loading="lazy"/>
        <ImageCard src={coffeeShop} loading="lazy"/>
        <ImageCard src={snowyVillage} loading="lazy"/>
        {/* <ImageCard src={edgewater} loading="lazy"/> */}
        <ImageCard src={summerFlowers} loading="lazy"/>
        {/* <ImageCard src={edgeWater2} loading="lazy"/> */}
        {/* <ImageCard src={sushi} loading="lazy"/> */}
        {/* <ImageCard src={kirkland} loading="lazy"/> */}
        <ImageCard src={mariners} loading="lazy"/>
        {/* <ImageCard src={alpine} loading="lazy"/> */}
        {/* <ImageCard src={fremont} loading="lazy"/> */}
      </div>

      {/* Floating Book Button - only visible on mobile */}
      <Link to="/book">
        <button className="floating-book-btn hide-on-desktop">📅 Book Now</button>
      </Link>      
    </div>
  );
}

function ImageCard({ src, caption }) {
  return (
    <figure className='image-card'>
      <img src={src} alt={caption || ''} />
      <figcaption className="caption">{caption}</figcaption>
    </figure>
  );
}
