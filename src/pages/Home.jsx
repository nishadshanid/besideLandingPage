import Hero from '../components/Hero.jsx'
import PosterCarousel from '../components/PosterCarousel.jsx'
import Courses from '../components/Courses.jsx'
import CourseStructure from '../components/CourseStructure.jsx'
import WhyBeside from '../components/WhyBeside.jsx'
import Testimonials from '../components/Testimonials.jsx'
import Reels from '../components/Reels.jsx'
import Faq from '../components/Faq.jsx'
import Register from '../components/Register.jsx'

export default function Home() {
  return (
    <main className="pt-16 lg:pt-20">
      <Hero />
      <PosterCarousel />
      <Courses />
      <CourseStructure />
      <WhyBeside />
      <Testimonials />
      <Reels />
      <Faq />
      <Register />
    </main>
  )
}
