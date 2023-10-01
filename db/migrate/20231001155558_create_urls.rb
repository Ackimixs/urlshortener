class CreateUrls < ActiveRecord::Migration[7.0]
  def change
    create_table :urls do |t|
      t.string :code
      t.string :long_url

      t.timestamps
    end
  end
end
