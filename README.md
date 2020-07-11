# Facebook Prevent Link Tracking

This is a very simple plugin which will remove the link tracking when browsing facebook.

### How does the tracking work
When a post is shared and contains an outbound link then facebook will convert it - so instead of sending you strait to the URL, they will send you to their own forwarding service, and then you will be sent to the desired URL. In this way they can monitor when and who is clickng on an outbound link.

Sometime they also warn about "You are now leaving facebook", but as long as you know what you're doing this is not relly needed.

### How does the plugin work?

This plugin is active when on facebook - and it constantly looks for facebooks tracking links. When it finds one it will extract the original URL, and replace the tracking URL with the original URL. Easy!
