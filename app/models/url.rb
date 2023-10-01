class Url < ApplicationRecord
  validates :code, presence: true
  validates :long_url, presence: true
end
