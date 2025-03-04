module.exports = {
  async redirects() {
    return [
      {
        source: '/login', 
        destination: '/dashboard', // Ensure this doesn't redirect users
        permanent: false,
      },
    ]
  },
}
