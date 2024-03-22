const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Get a fic summary by fic ID. A fic summary is only the details provided before clicking a fic
 */
router.get('/work/summary/:id', (req, res) => {
  const id = req.params.id;

  axios({
    method: 'GET',
    // Viewing adult and full work will allow us to scrape an entire fic without having to navigate to different pages
    url: `https://archiveofourown.org/works/${id}?view_adult=true&view_full_work=true`
  })
    .then((response) => {
      // Scraping using cheerio
      const $ = cheerio.load(response.data);

      // Grabbing the fic title
      // using .trim will get rid of newline characters in the text
      const title = $('.title.heading').text().trim();

      // Grabbing other info
      const author = $('.byline.heading').text().trim();
      const rating = $('.rating.tags ul').text().trim();
      const language = $('dd.language').text().trim();
      const series = $('.position a:first').text().trim();

      const warnings = [];
      $('.warning.tags li').each((i, el) => {
        warnings.push($(el).text().trim());
      })
      const categories = [];
      $('.category.tags li').each((i, el) => {
        categories.push($(el).text().trim());
      })
      const fandoms = [];
      $('.fandom.tags li').each((i, el) => {
        fandoms.push($(el).text().trim());
      })
      const relationships = [];
      $('.relationship.tags li').each((i, el) => {
        relationships.push($(el).text().trim());
      })
      const characters = [];
      $('.character.tags li').each((i, el) => {
        characters.push($(el).text().trim());
      })
      const tags = [];
      $('.freeform.tags li').each((i, el) => {
        tags.push($(el).text().trim());
      })
      const stats = {};
      $('.stats dt').each((i, el) => {
        stats[($(el).text().trim().slice(0, -1)).toLowerCase()] = $(el).next().text().trim();
      })
      const summary = [];
      $('#workskin .preface.group:first').find('.summary.module p').each((i, el) => {
        summary.push($(el).text().trim());
      })

      // Assemble summary
      const ficSummary = {
        id,
        title,
        author,
        rating,
        warnings,
        categories,
        fandoms,
        relationships,
        characters,
        tags,
        language,
        series,
        stats,
        summary
      }

      res.send(ficSummary);

    })
    .catch(() => {
      res.sendStatus(500);
    })
})


/**
 * Get all fic data for a fic by ID, this includes entire text body
 */
router.get('/work/:id', (req, res) => {
  const id = req.params.id;

  axios({
    method: 'GET',
    url: `https://archiveofourown.org/works/${id}?view_adult=true&view_full_work=true`
  })
    .then((response) => {

      // Scraping using cheerio
      const $ = cheerio.load(response.data);

      // Grabbing the fic title
      // using .trim will get rid of newline characters in the text
      const title = $('.title.heading').text().trim();

      // Grabbing other info
      const author = $('.byline.heading').text().trim();
      const rating = $('.rating.tags ul').text().trim();
      const language = $('dd.language').text().trim();
      const series = $('.position a:first').text().trim();

      const warnings = [];
      $('.warning.tags li').each((i, el) => {
        warnings.push($(el).text().trim());
      })
      const categories = [];
      $('.category.tags li').each((i, el) => {
        categories.push($(el).text().trim());
      })
      const fandoms = [];
      $('.fandom.tags li').each((i, el) => {
        fandoms.push($(el).text().trim());
      })
      const relationships = [];
      $('.relationship.tags li').each((i, el) => {
        relationships.push($(el).text().trim());
      })
      const characters = [];
      $('.character.tags li').each((i, el) => {
        characters.push($(el).text().trim());
      })
      const tags = [];
      $('.freeform.tags li').each((i, el) => {
        tags.push($(el).text().trim());
      })
      const stats = {};
      $('.stats dt').each((i, el) => {
        stats[($(el).text().trim().slice(0, -1)).toLowerCase()] = $(el).next().text().trim();
      })
      const summary = [];
      $('#workskin .preface.group:first').find('.summary.module p').each((i, el) => {
        summary.push($(el).text().trim());
      })
      const notes = [];
      $('#workskin .preface.group:first').find('.notes.module blockquote').children().each((i, el) => {
        if (el.name == 'ul') {
          $(el).find('li').each((j, li) => {
            notes.push($(li).text().trim());
          })
        } else {
          notes.push($(el).text().trim());
        }
      })

      // Creating a fic object
      const fic = {
        id,
        title,
        author,
        rating,
        warnings,
        categories,
        fandoms,
        relationships,
        characters,
        tags,
        language,
        series,
        stats,
        summary,
        notes,
        chapters: []
      };
      
      // Fics with only one chapter have a different structure than fics with multiple chapters, so we have 
      //  to scrape them differently
      if (fic.stats.chapters === '1/1') {
        console.log("Test")
        // Create chapter object
        const chapter = {
          chapter_title: '',
          chapter_summary: [],
          chapter_notes_start: [],
          chapter_notes_end: [],
          chapter_text: []
        }

        $('div#chapters div.userstuff p').each((i, elem) => {
          console.log(elem.name)
          chapter.chapter_text.push($(elem).text().trim());
        })

        fic.chapters.push(chapter);

      } else {

        // For each chapter div
        $('div#chapters').children().each((i, el) => {

          // Create a chapter object
          const chapter = {
            chapter_title: '',
            chapter_summary: [],
            chapter_notes_start: [],
            chapter_notes_end: [],
            chapter_text: []
          }

          $(el).children().each((j, chil) => {
            // In the first preface group, scrape chapter title, summary, and notes
            if (j == 0) {
              chapter.chapter_title = $(chil).find('.title').text().trim();

              $(chil).find('.summary.module blockquote p').each((k, line) => {
                chapter.chapter_summary.push($(line).text().trim());
              })

              $(chil).find('.notes.module blockquote').children().each((k, line) => {

                chapter.chapter_notes_start.push($(line).text().trim());
              })

              // In the chapter body, scrape paragraphs
            } else if (j == 1) {
              $(chil).find('p').each((k, line) => {
                chapter.chapter_text.push($(line).text().trim());
              });

              // If there are more than two children, then there is an end of chapter notes section we need to grab
            } else {
              $(chil).find('.end.notes.module blockquote p').each((k, line) => {
                chapter.chapter_notes_end.push($(line).text().trim());
              });
            }
          })
          fic.chapters.push(chapter);
        })
      }

      // Retrieved all fic data and formatted the object. Time to send!
      res.send(fic);

    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    })
});


/**
 * Get series info, including an array of work ids that belong to the series
 */
router.get('/series/:id', (req, res) => {
  const id = req.params.id;

  axios({
    method: 'GET',
    url: `https://archiveofourown.org/series/${id}`
  })
    .then((response) => {
      const $ = cheerio.load(response.data);

      // Series object
      const series = {
        id,
        name: '',
        creator: '',
        date_begun: '',
        date_updated: '',
        description: [],
        stats: {},
        works: []
      }

      series.name = $('h2.heading').text().trim();

      $('.series.meta.group').children().each((i, elem) => {
        if(i == 1){
          series.creator = $(elem).text().trim();
        } else if(i == 3){
          series.date_begun = $(elem).text().trim();
        } else if(i == 5){
          series.date_updated = $(elem).text().trim();
        } else if(i == 7){
          $(elem).find('blockquote.userstuff').children().each((j, line) => {
            series.description.push($(line).text().trim());
          })
        }
      })

      $('dl.stats:first').children().each((i, elem) => {
        if(elem.name == 'dt'){
          series.stats[($(elem).text().trim().slice(0, -1)).toLowerCase()] = $(elem).next().text().trim();
        }
      })

      $('ul.series.work.index.group').children().each((i, elem) => {
        series.works.push(elem.attribs.id.substring(5));
      })
      
      res.send(series);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    })
})


/**
 * Get a user's profile details by username
 */
router.get('/user/profile/:username', (req, res) => {
  const username = req.params.username;

  axios({
    method: 'GET',
    url: `https://archiveofourown.org/users/${username}/profile`
  })
    .then((response) => {
      const $ = cheerio.load(response.data);

      const pseuds = [];
      let date_joined;
      let id;
      let location;
      let birthday;

      $('.user.home.profile .wrapper .meta').children().each((i, elem) => {
        // Grab pseuds, aka an array of other pennames, if any
        if (i == 1) {
          console.log($(elem).find('a').text().trim());
          $(elem).find('a').each((j, chil) => {
            pseuds.push($(chil).text().trim());
          })
          // Date joined
        } else if (i == 3) {
          date_joined = $(elem).text().trim();
          // user id
        } else if (i == 5) {
          id = $(elem).text().trim();
          // location
        } else if (i == 7) {
          location = $(elem).text().trim();
          // birthday
        } else if (i == 9) {
          birthday = $(elem).text().trim();
        }
      })

      const user = {
        id,
        username,
        pseuds,
        date_joined,
        location,
        birthday,
        bio: []
      }

      $('.bio.module .userstuff p').each((i, elem) => {
        user.bio.push($(elem).text().trim());
      })

      res.send(user);
    })
    .catch(() => {
      res.sendStatus(500);
    })
})


/**
 * Get an array of a user's works' ids
 */
router.get('/user/works/:username', (req, res) => {
  const username = req.params.username;

  axios({
    method: 'GET',
    url: `https://archiveofourown.org/users/${username}/works`
  })
    .then((response) => {
      const $ = cheerio.load(response.data);

      const userWorks = {
        works: []
      }

      // Each work on the page is a list element. We can loop thru to grab each work
      $('ol.work.index.group').children().each((i, elem) => {
        const work_id = elem.attribs.id.substring(5);
        userWorks.works.push(work_id);
      })

      res.send(userWorks);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    })
})


/**
 * Get an array of a user's bookmarks' work ids
 */
router.get('/user/bookmarks/:username', (req, res) => {
  const username = req.params.username;

  axios({
    method: 'GET',
    url: `https://archiveofourown.org/users/${username}/bookmarks`
  })
    .then((response) => {
      const $ = cheerio.load(response.data);

      const userBookmarks = {
        bookmarks: []
      }

      // Each work on the page is a list element. We can loop thru to grab each work
      $('ol.bookmark.index.group').children().each((i, elem) => {
        const work_id = elem.attribs.id.substring(9);
        userBookmarks.bookmarks.push(work_id);
      })

      res.send(userBookmarks);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    })
})


/**
 * Get an array of a user's gifts' work ids
 */
router.get('/user/gifts/:username', (req, res) => {
  const username = req.params.username;

  axios({
    method: 'GET',
    url: `https://archiveofourown.org/users/${username}/gifts`
  })
    .then((response) => {
      const $ = cheerio.load(response.data);

      const userGifts = {
        gifts: []
      }

      $('ul.gift.work.index.group').children().each((i, elem) => {
        const work_id = elem.attribs.id.substring(5);
        userGifts.gifts.push(work_id);
      })

      res.send(userGifts);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    })
})


/**
 * Get an array of a user's series ids
 */
router.get('/user/series/:username', (req, res) => {
  const username = req.params.username;

  axios({
    method: 'GET',
    url: `https://archiveofourown.org/users/${username}/series`
  })
    .then((response) => {
      const $ = cheerio.load(response.data);

      const userSeries = {
        series: []
      }

      $('ul.series.index.group').children().each((i, elem) => {
        // These are not work ids! Series can contain multiple works and have an id of their own
        const series_id = elem.attribs.id.substring(7);
        userSeries.series.push(series_id);
      })

      res.send(userSeries);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    })
})


module.exports = router;
