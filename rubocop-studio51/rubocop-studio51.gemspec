# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name    = "rubocop-studio51"
  spec.version = "0.1.0"
  spec.authors = [ "Vlad Radulescu" ]
  spec.email   = [ "vlad@studio51.solutions" ]

  spec.summary     = "Studio51 house RuboCop cops"
  spec.description = <<~DESC
    Custom RuboCop cops enforcing the Studio51 Ruby house style: the
    documentation-block shape (bare `#` separators/terminators) and method
    breathing room (an empty line before a method's final expression).

    Consumed from every Studio51 Ruby repo as a git-sourced development
    dependency; configured per-repo via the scaffolded `.rubocop.yml`.
  DESC

  spec.homepage = "https://github.com/studio51/standards"
  spec.required_ruby_version = ">= 4.0.5"

  # Proprietary & confidential — internal Studio51 tooling. Not for public distribution.
  spec.license = "Nonstandard"
  spec.metadata["allowed_push_host"]     = "https://example.invalid" # block accidental public push
  spec.metadata["rubygems_mfa_required"] = "true"
  spec.metadata["source_code_uri"]       = spec.homepage

  spec.files = Dir[ "lib/**/*.rb", "README.md" ]

  spec.require_paths = [ "lib" ]

  spec.add_dependency "rubocop", ">= 1.50"
end
