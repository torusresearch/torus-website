<script>
export default {
  created() {
    const baseRoute = process.env.BASE_URL
    // will be sent to aws lambda which would give it the correct key
    window.location.href = `https://app.tor.us${baseRoute}error-pages/404-notfound.html`
  }
}
</script>
