import type { NextPage } from 'next';
import tw from 'twin.macro';

const Input = tw.input`border hover:border-black`

const Home: NextPage = () => {
  return (
    <div>
      <Input />
      <h1 tw="text-purple-50">Erin Lindford</h1>
      <h2 tw="text-purple-50">Customer Support</h2>
      <p tw="text-purple-500">erinlindford@example.com</p>
      <p tw="text-purple-900">(555) 765-4321</p>
    </div>
  );
}

export default Home
