import React, { useEffect, useState } from 'react'
import BannerHome from '../components/BannerHome'
import { useSelector, useDispatch } from 'react-redux'
import Card from '../components/Card'
import HorizontalScollCard from '../components/HorizontalScollCard'
import axios from 'axios'
import { setBannerData } from '../store/movieoSlice'  // import your action

const Home = () => {
  const dispatch = useDispatch();
  const trendingData = useSelector(state => state.movieoData.bannerData)
  const [nowPlayingData, setNowPlayingData] = useState([])
  const [topRatedData, setTopRatedData] = useState([])
  const [popularTvShowData, setPopularTvShowData] = useState([])
  const [onTheAirShowData, setOnTheAirShowData] = useState([])

  const baseURL = 'https://api.themoviedb.org/3'
  const apiKey = 'YOUR_API_KEY'

  const fetchData = async () => {
    try {
      const nowPlayingRes = await axios.get(`${baseURL}/movie/now_playing?api_key=${apiKey}`)
      const topRatedRes = await axios.get(`${baseURL}/movie/top_rated?api_key=${apiKey}`)
      const popularTvRes = await axios.get(`${baseURL}/tv/popular?api_key=${apiKey}`)
      const onTheAirRes = await axios.get(`${baseURL}/tv/on_the_air?api_key=${apiKey}`)
      const trendingRes = await axios.get(`${baseURL}/trending/all/week?api_key=${apiKey}`)

      setNowPlayingData(nowPlayingRes.data.results)
      setTopRatedData(topRatedRes.data.results)
      setPopularTvShowData(popularTvRes.data.results)
      setOnTheAirShowData(onTheAirRes.data.results)
      dispatch(setBannerData(trendingRes.data.results))

    } catch (error) {
      console.log("Error fetching data", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <BannerHome/>
      <HorizontalScollCard data={trendingData} heading={"Trending"} trending={true}/>
      <HorizontalScollCard data={nowPlayingData} heading={"Now Playing"} media_type={"movie"}/>
      <HorizontalScollCard data={topRatedData} heading={"Top Rated Movies"} media_type={"movie"}/>
      <HorizontalScollCard data={popularTvShowData} heading={"Popular TV Show"} media_type={"tv"}/>
      <HorizontalScollCard data={onTheAirShowData} heading={"On The Air"} media_type={"tv"}/>
    </div>
  )
}

export default Home
