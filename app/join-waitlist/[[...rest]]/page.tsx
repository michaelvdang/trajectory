import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <>
      <div
        className='flex flex-col items-center justify-center'
      >
        <h1
          className='text-3xl font-bold m-14'
        >Join Our Waitlist</h1>
        <SignIn forceRedirectUrl='/waitlist/success' />
      </div>
    </>
  )
}