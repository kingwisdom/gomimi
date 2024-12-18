
const Landing: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            {/* Header Section */}
            <header className="bg-teal-400 w-full p-6 text-center">
                <h1 className="text-4xl font-bold text-white">Welcome to Our AI Platform</h1>
                <p className="text-lg text-white mt-2">Your gateway to job opportunities and storytelling.</p>
            </header>

            {/* Main Content Section */}
            <main className="flex-grow flex flex-col items-center justify-center mt-10">
                <h2 className="text-3xl font-semibold mb-6">Explore Our Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {/* Job Card */}
                    <div className="card w-80 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <figure className="px-10 pt-10">
                            <img src="https://static.vecteezy.com/system/resources/previews/051/959/090/non_2x/3d-rendering-of-a-resume-with-a-standing-figure-on-top-representing-job-search-employment-and-career-planning-png.png" alt="Job Opportunities" className="rounded-xl" />
                        </figure>
                        <div className="card-body text-center">
                            <h2 className="card-title">For Job Opportunities</h2>
                            <p>Use our platform to create your resume , apply for jobs, and connect with potential employers.</p>
                            <div className="card-actions justify-center">
                                <a href="/job" className="btn btn-yellow-400">Create Resume</a>
                            </div>
                        </div>
                    </div>

                    {/* Story Card */}
                    <div className="card w-80 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <figure className="px-10 pt-10">
                            <img src="https://blog.accessdevelopment.com/hs-fs/hubfs/storytelling%20blog%20feature%20image.png?width=596&name=storytelling%20blog%20feature%20image.png" alt="Storytelling" className="rounded-xl" />
                        </figure>
                        <div className="card-body text-center">
                            <h2 className="card-title">Storytelling</h2>
                            <p>Use our AI to create engaging stories. Inspire others!</p>
                            <div className="card-actions justify-center">
                                <a href="/story" className="btn btn-yellow-400">Create Stories</a>
                            </div>
                        </div>
                    </div>

                    {/* Additional Card Example */}
                    <div className="card w-80 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <figure className="px-10 pt-10">
                            <img src="https://via.placeholder.com/150" alt="Community" className="rounded-xl" />
                        </figure>
                        <div className="card-body text-center">
                            <h2 className="card-title">Community</h2>
                            <p>Join our community of like-minded individuals. Connect and collaborate (coming soon)!</p>
                            <div className="card-actions justify-center">
                                <a href="/#" className="btn btn-yellow-400">Join Us</a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="h-20"></div>

            {/* Footer Section */}
            {/* <footer className="bg-gray-200 w-full p-4 text-center">
                <p className="text-gray-600">© 2023 Your Company. All rights reserved.</p>
            </footer> */}
        </div>
    )
}

export default Landing