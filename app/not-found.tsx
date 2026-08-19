import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4'>
      <div className='bg-white rounded-3xl shadow-soft p-8 max-w-md w-full text-center'>
        <div className='text-8xl mb-4'>🔍</div>
        <h1 className='text-6xl font-bold text-gray-800 mb-2'>404</h1>
        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
          页面走丢了
        </h2>
        <p className='text-gray-600 mb-8'>
          小语找不到这个页面呢，要不要回到首页看看？
        </p>
        <Link
          href='/'
          className='inline-block px-8 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full hover:shadow-lg transition-shadow'
        >
          回到首页
        </Link>
      </div>
    </div>
  );
}
