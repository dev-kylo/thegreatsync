import type { NextPage } from 'next';
import tw from 'twin.macro';

const Input = tw.input`border hover:border-black`

const Home: NextPage = () => {
  return (
    <div>
      <Input />
      {/* <h1 tw="text-lg">Erin Lindford</h1>
      <h2 tw="text-purple">Customer Support</h2>
      <p tw="text-gray">erinlindford@example.com</p>
      <p tw="text-gray">(555) 765-4321</p> */}
    </div>
  );
}

export default Home
