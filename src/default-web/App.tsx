'use client'

import { GlobalSearch } from '@/components/search/global-search'
import { About } from './components/sections/About'
import { Connect } from './components/sections/Connect'
import { Footer } from './components/sections/Footer'
import { Grow } from './components/sections/Grow'
import { Hero } from './components/sections/Hero'
import { Leadership } from './components/sections/Leadership'
import { Navbar } from './components/sections/Navbar'
import { NewToWkc } from './components/sections/NewToWkc'
import { Resources } from './components/sections/Resources'
import { Schedule } from './components/sections/Schedule'

export default function App() {
  return (
    <div className="default-web-site">
      <Navbar />
      <GlobalSearch mode="static" scanDom showTrigger className="fixed bottom-4 right-4 z-40" />
      <main>
        <Hero />
        <NewToWkc />
        <About />
        <Leadership />
        <Connect />
        <Grow />
        <Resources />
        <Schedule />
      </main>
      <Footer />
    </div>
  )
}
