require 'minitest/autorun'
require 'zlib'
require 'tempfile'

class DecompressReverseLinesTest < Minitest::Test
  def test_decompress_and_reverse
    Dir.mktmpdir do |dir|
      input_txt = File.join(dir, 'input.txt')
      gzip_file = File.join(dir, 'input.txt.gz')
      output_txt = File.join(dir, 'output.txt')
      File.write(input_txt, "hello\nworld\n")
      Zlib::GzipWriter.open(gzip_file) { |gz| gz.write File.read(input_txt) }

      system("npx ts-node packages/shared-utils/decompressReverseLines.ts #{gzip_file} #{output_txt}")
      result = File.read(output_txt)
      assert_equal "olleh\ndlrow\n", result
    end
  end
end
