import coffeeShop from './assets/coffee-shop-img.svg';
import edgeWater2 from './assets/edgewater-2-img.svg';
import edgewater from './assets/edgewater-img.svg';
import fallFolliage from './assets/fall-folliage.svg';
import goldenGardens from './assets/golden-gardens.svg';
import golf from './assets/golf-img.svg';
import poke from './assets/poke-img.svg';
import seattleAbove from './assets/seattle-above.svg';
import snowyVillage from './assets/snowy-village-img.svg';
import summerFlowers from './assets/summer-flowers.svg';
import sushi from './assets/sushi-img.svg';
import aisha from './assets/aisha-prof-pic.svg';
import jan from './assets/jan-prof-pic.svg';
import jacob from './assets/jacob-prof-pic.svg';
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
        </section>

        <section className="section section-spacer">
          <h2>👯‍♀️ Meet Your Local Friend</h2>
            <p>We match you with a vetted Seattle local.</p>
        </section>

        <section className="section section-spacer">
          <h2>🗺️ Explore Together</h2>
            <p>Custom-planned day + candid photos.</p>
        </section>

        {/* Hide on mobile */}
        <Link to="/book" className="hide-on-mobile">
          <button className="button">Book Your Local Buddy</button>
        </Link>

        <section className="section section-spacer">
          <h2>💼 Packages and Pricing</h2>
          <p>Half-Day (4 hrs) — <strong>$150</strong></p>
          <p>Full Day (8 hrs) — <strong>$250</strong></p>
          <p>Includes itinerary planning, guiding, and candid photos.</p>
        </section>

        <section className="section">
          <h2>📍 Custom Itinerary</h2>
          <p>1-Day Plan — <b>$50</b></p>
          <p>3-Day Plan — <b>$120</b></p>
          <p>For when you don't need a guide but would like a plan.</p>
          {/* Hide on mobile */}
          <Link to="/itineraries" className="hide-on-mobile">
            <button className="button">Learn More About Itineraries</button>
          </Link>
          {/* Hide on desktop */}
          <Link to="/itineraries" className="hide-on-desktop">
            <button className="button section-spacer mobile-button">Get An Itinerary</button>
          </Link>
        </section>

        <section className="section section-spacer">
          <h2>📋 Quick Rec List</h2>
          <p>Curated "top picks" list — <b>$25</b></p>
          <p>Best for short trips or last-minute planning.</p>
        </section>

        <section className="section">
          <h2>🤠 Meet The Locals</h2>
          <div className='pic-and-text'>
            <img className="prof-pic" src={aisha} alt="Aisha"/>
            <p><strong>Aisha</strong> — Raised in Seattle. Loves coffee shops, views, and ferry rides.</p>
          </div>
          <div className='pic-and-text'>
            <img className="prof-pic" src={jan} alt="Jan"/>
            <p><strong>Jan</strong> — From Guam. Loves breweries, festivals, meeting people.</p>
          </div>
          <div className='pic-and-text'>
            <img className="prof-pic" src={jacob} alt="Jacob"/>
            <p><strong>Jacob</strong> — From Milwaukee. Loves Seattle, music, coffee.</p>
          </div>
          {/* Hide on mobile */}
          <Link to="/book" className="hide-on-mobile">
            <button className="button">Book Your Local Buddy</button>
          </Link>
        </section>

        <section className="section section-spacer">
          <h2>📝 The Reviews Are In</h2>
          <p>⭐️⭐️⭐️⭐️⭐️</p>
          <p>
            <b><i>“What was a lonely post-breakup trip turned into a social getaway”</i></b> — Christina B.
          </p>
          <p>⭐️⭐️⭐️⭐️⭐️</p>
          <p>
            <b><i>“I loved meeting Jacob and exploring the town! 10/10 experience.”</i></b> — Felicidad S.
          </p>
        </section>
      </div>

      {/* RIGHT COLUMN */}
      <div className="image-grid hide-on-mobile">
        <ImageCard src={fallFolliage} loading="lazy" />
        <ImageCard src={poke} loading="lazy"/>
        <ImageCard src={golf} loading="lazy"/>
        <ImageCard src={seattleAbove} loading="lazy"/>
        <ImageCard src={coffeeShop} loading="lazy"/>
        <ImageCard src={summerFlowers} loading="lazy"/>
        <ImageCard src={edgewater} loading="lazy"/>
        <ImageCard src={sushi} loading="lazy"/>
        <ImageCard src={edgeWater2} loading="lazy"/>
        <ImageCard src={goldenGardens} loading="lazy"/>
      </div>

      {/* Floating Book Button - only visible on mobile */}
      <Link to="/book">
        <button className="floating-book-btn">📅 Book Now</button>
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
