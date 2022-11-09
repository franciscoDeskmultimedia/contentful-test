import { Swiper, SwiperSlide } from 'swiper/react';

import Link from 'next/link'
import Image from 'next/image'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Slider = (props) => {
    console.log(props)
    return(
        <Swiper
            spaceBetween={50}
            slidesPerView={1}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
         >
            {props.slides.map((slideItem,index)=>{
                return(
                    <SwiperSlide key={index}>
                        <img src={slideItem.image.url}></img>
                        {slideItem.title}
                        <div className='cta'>
                        
                        <Link href={slideItem.cta.url} aria-label={slideItem.cta.text}>
                            {slideItem.cta.text}
                        </Link>
                        </div>

                    </SwiperSlide>
                )
            })}
        
      </Swiper>
    
    )
}

export default Slider;