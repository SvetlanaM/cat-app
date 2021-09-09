import Image from '../components/Image';
import BackButton from '../components/BackButton';
import Link from 'next/link';
import { APP_NAME } from '../utils/constants';
import Header from '../components/Head';
import getTitle from '../utils/getTitle';

export default function Custom404() {
  return (
    <>
      <Header title={getTitle('404 - Stranka nenajdena')} />
      <div className="flex flex-col xl-custom:flex-row w-full justify-center h-screen items-center my-2">
        <div className="xl-custom:w-1/2 flex items-center px-10 xl-custom:px-20 flex-col text-purple">
          <Link href="/">
            <a className="font-logo font-bold text-lg uppercase text-purple-dark">
              {APP_NAME}
            </a>
          </Link>
          <h1 className="text-center font-bold text-lg py-3">
            Mnaaau...stranku nam macicky niekde zakotulali. Bude bud pod gaucom
            alebo pod postelou.
          </h1>
          <div className="py-5">
            <Image src="/icons/404.png" height={70} width={400} />
          </div>
          <Link href="/dashboard">
            <a className="font-bold text-purple-light hover:text-purple">
              SPET NA PREHLAD
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}
