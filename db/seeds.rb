5.times do
  Url.create({
    code: Faker::Alphanumeric.alpha(number: 10),
    long_url: Faker::Internet.url
  })
end