import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="min-h-[80vh] pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
            <span className="text-sky-500">Aegis:</span> Simple Authentication
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
            Integrate secure authentication into your applications in minutes, not hours.
            Aegis handles user management, login flows, and security so you don't have to.
          </p>
          <div className="mt-10 flex justify-center space-x-6">
            <Link
              to="/register"
              className="px-8 py-3 text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 transition-colors duration-200"
            >
              Get Started
            </Link>
            <Link
              to="/docs"
              className="px-8 py-3 text-base font-medium rounded-md text-sky-500 bg-neutral-700 hover:bg-neutral-600 transition-colors duration-200"
            >
              Documentation
            </Link>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-12">Why choose Aegis?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-800 p-6 rounded-lg">
              <div className="text-sky-500 text-2xl mb-3">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure by Default</h3>
              <p className="text-gray-400">
                Built with security best practices including encrypted passwords, 
                secure session management, and protection against common vulnerabilities.
              </p>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg">
              <div className="text-sky-500 text-2xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Quick Integration</h3>
              <p className="text-gray-400">
                Simple API with clear documentation and client libraries.
                Integrate authentication into your application in minutes.
              </p>
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg">
              <div className="text-sky-500 text-2xl mb-3">🛠️</div>
              <h3 className="text-xl font-semibold mb-2">Customizable</h3>
              <p className="text-gray-400">
                Adapt the authentication flow to your needs with custom fields,
                branding options, and flexible configuration.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 mb-12 text-center">
          <Link
            to="/docs"
            className="text-sky-500 hover:text-sky-400 text-lg font-medium transition-colors duration-200"
          >
            Read the documentation →
          </Link>
        </div>
      </div>
    </div>
  );
}
