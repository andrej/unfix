# `unfix` -- User Script to Remove any Sticky or Fixed Elements on Websites

On "modern" websites (especially news sites), the main content is usually obstructed by large sticky/fixed-position elements overlaid on top of the remaining content. Large headers, CCPA prompts, ads, etc. occupy significant screen space even as you scroll. The purpose or preceived advantage of this is unclear to me.

This user script gives you back most of your screen space by removing the sticky styling for any `position: fixed` and `position: sticky` elements. It seems to work fairly well with most websites, even if they dynamically change stickiness using scripts.
