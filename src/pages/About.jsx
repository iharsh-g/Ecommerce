import React from 'react'
import AuthenticityImg from '../data/images/authenticity.jpg';
import SecureImg from '../data/images/secure.jpeg';
import ServiceImg from '../data/images/Customer Service.jpg';
import PossibilitesImg from '../data/images/Possibilities.png';

function About() {
    return (
        <div className='min-h-[69vh]'>
            <div className='mx-auto max-w-[1200px] flex flex-col items-center justify-center py-10 px-3'>
                <p className='text-4xl font-bold text-center'>Welcome to Ecommerce Website!</p>
                <p className='mt-5 tracking-wide text-neutral-600 sm:text-center text-lg text-justify'>At Ecommerce, we believe in the power of online shopping to transform the way you experience retail. Our mission is to provide you with a seamless and enjoyable shopping experience, right from the comfort of your own home. With a wide range of products, exceptional customer service, and secure transactions, we are here to redefine your online shopping journey.</p>
            </div>

            
            <div className='mt-10 bg-slate-800 sm:py-16 py-10'>
                <div className='mx-auto max-w-[1200px] px-3'>
                    {/* Section 1 */}
                    <div className='flex lg:justify-between w-full items-center md:flex-row flex-col justify-center gap-10'>
                        <div className='md:w-[50%]'>
                            <img src={PossibilitesImg} alt='' className='w-[350px] h-[250px] rounded-md shadow-xl shadow-red-900 lg:ml-20'/>
                        </div>
                        <div className='md:w-[50%]'>
                            <p className='text-neutral-400 text-justify text-lg tracking-wide'>Step into our virtual store and explore a world of endless possibilities. From fashion and beauty to home decor and electronics, we have carefully curated a diverse collection of products to cater to your unique needs and preferences. Whether you're looking for the latest fashion trends, innovative gadgets, or stylish home accents, we've got you covered.</p>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className='flex lg:justify-between w-full items-center sm:my-20 my-10 md:flex-row flex-col-reverse justify-center gap-10'>
                        <div className='md:w-[50%]'>
                            <p className='text-neutral-400 text-justify text-lg tracking-wide'>We understand that purchasing products online can sometimes be overwhelming. That's why we go the extra mile to ensure that every item featured on our platform meets the highest standards of quality and authenticity. We collaborate with reputable brands and trusted suppliers to bring you products that are genuine, durable, and built to last.</p>
                        </div>
                        <div className='md:w-[50%] md:flex md:justify-end lg:mr-20'>
                            <img src={AuthenticityImg} alt='' className='w-[350px] h-[250px] rounded-md shadow-xl shadow-red-900'/>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className='flex lg:justify-between w-full items-center sm:my-20 my-10 md:flex-row flex-col justify-center gap-10'>
                        <div className='md:w-[50%]'>
                            <img src={ServiceImg} alt='' className='w-[350px] h-[250px] rounded-md shadow-xl shadow-red-900 lg:ml-20'/>
                        </div>
                        <div className='md:w-[50%]'>
                            <p className='text-neutral-400 text-justify text-lg tracking-wide'>At Ecommerce, we prioritize your satisfaction above all else. Our dedicated customer service team is here to assist you at every step of your shopping journey. If you have any questions, concerns, or need assistance with your order, feel free to reach out to us. We are committed to providing timely and personalized support to ensure your shopping experience is nothing short of exceptional.</p>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className='flex lg:justify-between w-full items-center sm:mt-20 mt-10 md:flex-row flex-col-reverse justify-center gap-10'>
                        <div className='md:w-[50%]'>
                            <p className='text-neutral-400 text-justify text-lg tracking-wide'>We understand the importance of security when it comes to online transactions. That's why we have implemented robust security measures to protect your personal information and ensure safe payments. With our user-friendly interface, you can easily navigate through our website, browse products, and make secure purchases with just a few clicks.</p>
                        </div>
                        <div className='md:w-[50%] md:flex md:justify-end lg:mr-20'>
                            <img src={SecureImg} alt='' className='w-[350px] h-[250px] rounded-md shadow-xl shadow-red-900'/>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mx-auto max-w-[1200px] flex flex-col items-center justify-center py-10 pb-16 px-3'>
                <p className='mt-10 text-4xl font-bold'>Stay Connected!</p>
                <p className=' mt-5 tracking-wide text-neutral-600 sm:text-center text-lg text-justify'>To stay updated on the latest arrivals, promotions, and exclusive offers, we invite you to join our mailing list and follow us on social media. By becoming a part of our community, you'll be the first to know about exciting deals and new product launches. We also encourage you to share your shopping experience with us and provide feedback so that we can continuously improve and enhance our services.</p>
            </div>

        </div>
    )
}

export default About