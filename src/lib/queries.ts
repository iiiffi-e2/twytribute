export const SHOWS_QUERY = `*[_type == "show"] | order(date desc) {
  _id, venue, city, date, ticketUrl, isFeatured, status, recapUrl
}`;

export const FEATURED_SHOW_QUERY = `*[_type == "show" && isFeatured == true][0] {
  _id, venue, city, date, ticketUrl, isFeatured, status, recapUrl
}`;

export const GALLERY_QUERY = `*[_type == "galleryItem"] | order(sortOrder asc) {
  _id, alt, category, label, sortOrder, "imageUrl": image.asset->url
}`;

export const VIDEOS_QUERY = `*[_type == "video"] | order(sortOrder asc) {
  _id, title, tag, youtubeId, sortOrder, "posterUrl": poster.asset->url
}`;

export const BAND_MEMBERS_QUERY = `*[_type == "bandMember"] | order(sortOrder asc) {
  _id, name, role, bio, funFact, photoPosition, sortOrder, "photoUrl": photo.asset->url
}`;
